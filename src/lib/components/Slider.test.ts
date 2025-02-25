import { render, cleanup, fireEvent } from '@testing-library/svelte';
import { expect, test, afterEach, describe } from 'vitest';
import Slider from './Slider.svelte';

// 각 테스트 후 정리
afterEach(() => {
    cleanup();
});

describe('Slider 컴포넌트 테스트', () => {
    test('Slider 컴포넌트가 올바르게 렌더링되는지 확인', async () => {
        // 컴포넌트 렌더링
        const { container } = render(Slider, {
            props: {
                value: 50,
                label: '테스트 슬라이더',
                unit: '%',
                min: 0,
                max: 100
            }
        });

        // 레이블이 올바르게 렌더링되는지 확인
        const labels = container.querySelectorAll('label');
        expect(labels.length).toBe(2);
        expect(labels[0].textContent).toBe('테스트 슬라이더');
        expect(labels[1].textContent).toBe('50%');

        // 슬라이더 입력 요소가 존재하고 속성값이 올바른지 확인
        const slider = container.querySelector('input[type="range"]');
        expect(slider).not.toBeNull();
        expect(slider?.getAttribute('min')).toBe('0');
        expect(slider?.getAttribute('max')).toBe('100');
        expect((slider as HTMLInputElement).value).toBe('50');

        // 슬라이더 값을 변경하고 업데이트 확인
        if (slider) {
            await fireEvent.input(slider, { target: { value: '75' } });
            expect(container.querySelectorAll('label')[1].textContent).toBe('75%');
        }
    });

    // 다양한 입력값에 대한 테스트
    test('다양한 입력값에 대한 렌더링 확인', async () => {
        const testCases = [
            { value: 25, label: '음량', unit: 'dB' },
            { value: 0.5, label: '비율', unit: 'x' },
            { value: 200, label: '길이', unit: 'cm' }
        ];

        for (const testCase of testCases) {
            const { container, unmount } = render(Slider, {
                props: {
                    value: testCase.value,
                    label: testCase.label,
                    unit: testCase.unit
                }
            });

            const labels = container.querySelectorAll('label');
            expect(labels[0].textContent).toBe(testCase.label);
            expect(labels[1].textContent).toBe(`${testCase.value}${testCase.unit}`);

            unmount();
        }
    });

    // 경계값 테스트 (최소값, 최대값)
    test('경계값 테스트', async () => {
        // 최소값 테스트
        const { container: minContainer } = render(Slider, {
            props: {
                value: 0,
                label: '최소값 테스트',
                unit: '',
                min: 0,
                max: 100
            }
        });

        let slider = minContainer.querySelector('input[type="range"]');
        expect((slider as HTMLInputElement).value).toBe('0');

        // 경계를 벗어난 값 설정 시도 (최소값 미만)
        if (slider) {
            await fireEvent.input(slider, { target: { value: '-10' } });
            // 최소값으로 제한되어야 함
            expect((slider as HTMLInputElement).value).toBe('0');
        }

        cleanup();

        // 최대값 테스트
        const { container: maxContainer } = render(Slider, {
            props: {
                value: 100,
                label: '최대값 테스트',
                unit: '',
                min: 0,
                max: 100
            }
        });

        slider = maxContainer.querySelector('input[type="range"]');
        expect((slider as HTMLInputElement).value).toBe('100');

        // 경계를 벗어난 값 설정 시도 (최대값 초과)
        if (slider) {
            await fireEvent.input(slider, { target: { value: '110' } });
            // 최대값으로 제한되어야 함
            expect((slider as HTMLInputElement).value).toBe('100');
        }
    });

    // 접근성 테스트
    test('접근성 기능 테스트', () => {
        // 테스트를 위한 더 단순한 접근으로 변경
        const { container } = render(Slider, {
            props: {
                value: 50,
                label: '접근성 테스트',
                unit: '%',
                min: 0,
                max: 100
            }
        });

        // ID 확인
        const slider = container.querySelector('input[type="range"]');
        const labels = container.querySelectorAll('label');

        // 슬라이더가 존재하는지 확인
        expect(slider).not.toBeNull();

        // 슬라이더에 ID가 있는지 확인
        expect(slider?.id).not.toBe('');

        // 레이블의 for 속성이 슬라이더의 ID와 일치하는지 확인
        const sliderId = slider?.id;
        expect(labels[0].getAttribute('for')).toBe(sliderId);
        expect(labels[1].getAttribute('for')).toBe(sliderId);

        // 기본 속성이 올바르게 설정되었는지 확인
        expect(slider?.getAttribute('min')).toBe('0');
        expect(slider?.getAttribute('max')).toBe('100');
        expect((slider as HTMLInputElement).value).toBe('50');
    });

    // 이벤트 핸들러 테스트
    test('이벤트 핸들러 테스트', async () => {
        let callbackValue = 0;

        // 값을 직접 업데이트하는 방식으로 변경
        // Svelte 5에서는 양방향 바인딩을 다르게 처리
        const { container, component } = render(Slider, {
            props: {
                value: 30,
                label: '이벤트 테스트',
                unit: '',
                min: 0,
                max: 100
            }
        });

        // Slider 값 초기값 확인
        const slider = container.querySelector('input[type="range"]');
        expect((slider as HTMLInputElement).value).toBe('30');

        // 컴포넌트 인스턴스에 직접 접근하여 값 변경 시도
        if (slider) {
            // 이벤트 발생
            await fireEvent.input(slider, { target: { value: '60' } });

            // 레이블에 반영된 값 확인 (내부 상태가 업데이트되었는지)
            expect(container.querySelectorAll('label')[1].textContent).toBe('60');

            // 실제 DOM 요소의 값도 변경되었는지 확인
            expect((slider as HTMLInputElement).value).toBe('60');
        }
    });
});